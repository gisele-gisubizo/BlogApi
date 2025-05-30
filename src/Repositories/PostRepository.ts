// import { AppDataSource } from "../config/database";
// import { Post } from "../entities/Post";

// export const PostRepository = AppDataSource.getRepository(Post).extend({
//   async createPost(postData: Partial<Post>): Promise<Post> {
//     const post = this.create(postData);
//     return this.save(post);
//   },

//   async findAll(page: number, limit: number): Promise<[Post[], number]> {
//     return this.findAndCount({
//       take: limit,
//       skip: (page - 1) * limit,
//       relations: ["author"],
//     });
//   },

//   async findById(id: number): Promise<Post> {
//     const post = await this.findOne({
//       where: { id },
//       relations: ["author"],
//     });
//     if (!post) {
//       throw new Error("Post not found");
//     }
//     return post;
//   },

//   async updatePost(post: Post): Promise<Post> {
//     return this.save(post);
//   },

//   async deletePost(id: number): Promise<void> {
//     await this.delete(id);
//   },
// });