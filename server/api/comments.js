export default eventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  try {
    if (method === "GET") {
      const articleId = query.articleId;
      if (!articleId) {
        throw { statusCode: 400, statusMessage: "Article ID is required" };
      }
      return getCommentsByArticleId(articleId);
    } else if (method === "POST") {
      const { articleId, author, content } = await readBody(event);
      if (!articleId || !author || !content) {
        throw { statusCode: 400, statusMessage: "Article ID, author, and content are required" };
      }
      const newId = createComment(articleId, author, content);
      return {
        statusCode: 201,
        body: {
          message: "Comment created successfully",
          commentId: newId,
        },
      };
    } else if (method === "DELETE") {
      const commentId = query.commentId;
      if (!commentId) {
        throw { statusCode: 400, statusMessage: "Comment ID is required" };
      }
      const result = deleteComment(commentId);
      if (result === 0) {
        throw { statusCode: 404, statusMessage: "Comment not found" };
      }
      return {
        statusCode: 200,
        body: {
          message: "Comment deleted successfully",
        },
      };
    } else {
      throw { statusCode: 405, statusMessage: "Method Not Allowed" };
    }
  } catch (error) {
    console.log("Error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: {
        message: error.statusMessage || "Internal Server Error",
      },
    };
  }
});