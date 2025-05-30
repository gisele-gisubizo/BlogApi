import { AppDataSource } from "../config/database";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { ValidationError, NotFoundError, ForbiddenError } from "../utils/errors";

export class PostService {
  private postRepository = AppDataSource.getRepository(Post);

  async createPost(title: string, body: string, author: User) {
    if (!title || !body) {
      throw new ValidationError("Title and body are required", {});
    }

    const post = await this.postRepository.save(this.postRepository.create({ title, body, author }));
    return post;
  }

  async getPosts(page: number, limit: number) {
    const [posts, total] = await this.postRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ["author"],
    });
    return { posts, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) {
      throw new NotFoundError("Post");
    }
    return post;
  }

  async updatePost(id: number, title: string, body: string, user: User) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) {
      throw new NotFoundError("Post");
    }
    if (post.author.id !== user.id) {
      throw new ForbiddenError("Not authorized to update this post");
    }

    post.title = title || post.title;
    post.body = body || post.body;
    return await this.postRepository.save(post);
  }

  async deletePost(id: number, user: User) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) {
      throw new NotFoundError("Post");
    }
    if (post.author.id !== user.id) {
      throw new ForbiddenError("Not authorized to delete this post");
    }

    await this.postRepository.delete(id);
    return { message: "Post deleted successfully" };
  }
}