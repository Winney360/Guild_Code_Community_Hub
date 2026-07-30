import { Response } from 'express';
import mongoose from 'mongoose';
import { Comment } from '../models/Comment.js';
import { Collaboration } from '../models/Collaboration.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

// @desc    Post a comment on a collaboration
// @route   POST /api/collaborations/:id/comments
// @access  Private (Registered members)
export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { text, parentId } = req.body;
    const userId = req.user?.id as string;
    const collaborationId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    if (!text || !text.trim()) {
      res.status(400).json({ message: 'Comment text is required' });
      return;
    }

    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      res.status(404).json({ message: 'Collaboration request not found' });
      return;
    }

    const comment = new Comment({
      userId: new mongoose.Types.ObjectId(userId),
      collaborationId: new mongoose.Types.ObjectId(collaborationId),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
      text,
    });
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'fullName profilePicture'
    );

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Post owner or admin only)
export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const commentId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const collaboration = await Collaboration.findById(comment.collaborationId);
    if (!collaboration) {
      res.status(404).json({ message: 'Collaboration request not found' });
      return;
    }

    // Spec rule: Post owner or Admin only can delete comment (Comment author cannot delete their own comment)
    const isPostOwner = collaboration.byUser.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isPostOwner && !isAdmin) {
      res.status(403).json({
        message: 'Forbidden: Only the collaboration post owner or administrators can delete comments',
      });
      return;
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
