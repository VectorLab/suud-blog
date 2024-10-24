export default eventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  try {
    if (method === "GET") {
      if (query.id) {
        const article = getArticleById(query.id);
        if (!article) {
          throw { statusCode: 404, statusMessage: "Article not found" };
        }
        return article;
      } else {
        return getAllArticles();
      }
    } else if (method === "POST") {
      const { title, content, created_at } = await readBody(event);

      if (!title || !content || !created_at) {
        throw { statusCode: 400, statusMessage: "Title, content, and publish time are required" };
      }

      const newId = createArticle(title, content, created_at);

      return {
        statusCode: 201,
        body: {
          message: "Article created successfully",
          articleId: newId,
        },
      };
    } else if (method === "PUT") {
      const { id, title, content, created_at } = await readBody(event);

      if (!id || !title || !content || !created_at) {
        throw { statusCode: 400, statusMessage: "ID, title, content, and publish time are required for update" };
      }

      const updated = updateArticle(id, title, content, created_at);

      if (!updated) {
        throw { statusCode: 404, statusMessage: "Article not found" };
      }

      return {
        statusCode: 200,
        body: {
          message: "Article updated successfully",
          article: updated,
        },
      };
    } else if (method === "DELETE") {
      const { id } = query;

      if (!id) {
        throw { statusCode: 400, statusMessage: "Article ID is required for deletion" };
      }

      const result = deleteArticle(id);

      if (result === 0) {
        throw { statusCode: 404, statusMessage: "Article not found" };
      }

      return {
        statusCode: 200,
        body: {
          message: "Article deleted successfully",
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