import { PostRepository } from "../Repositories/PostRepository";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

export class PostService {
  async createPost(title: string, body: string, author: User) {
    if (!title || !body) {
      throw { status: 400, message: "Title and body are required" };
    }

    const post = await PostRepository.createPost({ title, body, author });
    return post;
  }

  async getPosts(page: number, limit: number) {
    const [posts, total] = await PostRepository.findAll(page, limit);
    return { posts, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getPostById(id: number) {
    try {
      const post = await PostRepository.findById(id);
      return post;
    } catch (error: any) {
      throw { status: 404, message: error.message || "Post not found" };
    }
  }

  async updatePost(id: number, title: string, body: string, user: User) {
    try {
      const post = await PostRepository.findById(id);
      if (post.author.id !== user.id) {
        throw { status: 403, message: "Not authorized to update this post" };
      }

      post.title = title || post.title;
      post.body = body || post.body;
      return await PostRepository.updatePost(post);
    } catch (error: any) {
      throw { status: error.status || 404, message: error.message || "Post not found" };
    }
  }

  async deletePost(id: number, user: User) {
    try {
      const post = await PostRepository.findById(id);
      if (post.author.id !== user.id) {
        throw { status: 403, message: "Not authorized to delete this post" };
      }

      await PostRepository.deletePost(id);
      return { message: "Post deleted successfully" };
    } catch (error: any) {
      throw { status: error.status || 404, message: error.message || "Post not found" };
    }
  }
}