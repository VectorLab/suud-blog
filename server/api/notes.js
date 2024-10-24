export default eventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  try {
    if (method === "GET") {
      if (query.id) {
        const note = getNoteById(query.id);
        if (!note) {
          throw { statusCode: 404, statusMessage: "Note not found" };
        }
        return note;
      } else {
        return getAllNotes();
      }
    } else if (method === "POST") {
      const noteData = await readBody(event);

      if (!noteData.symbol || !noteData.type || !noteData.datetime || !noteData.price || !noteData.quantity) {
        throw { statusCode: 400, statusMessage: "Symbol, type, datetime, price, and quantity are required" };
      }

      const newId = createNote(noteData);

      return {
        statusCode: 201,
        body: {
          message: "Note created successfully",
          noteId: newId,
        },
      };
    } else if (method === "PUT") {
      const { id, ...noteData } = await readBody(event);

      if (!id || !noteData.symbol || !noteData.type || !noteData.datetime || !noteData.price || !noteData.quantity) {
        throw { statusCode: 400, statusMessage: "ID, symbol, type, datetime, price, and quantity are required for update" };
      }

      const updated = updateNote(id, noteData);

      if (!updated) {
        throw { statusCode: 404, statusMessage: "Note not found" };
      }

      return {
        statusCode: 200,
        body: {
          message: "Note updated successfully",
          note: updated,
        },
      };
    } else if (method === "DELETE") {
      const { id } = query;

      if (!id) {
        throw { statusCode: 400, statusMessage: "Note ID is required for deletion" };
      }

      const result = deleteNote(id);

      if (result === 0) {
        throw { statusCode: 404, statusMessage: "Note not found" };
      }

      return {
        statusCode: 200,
        body: {
          message: "Note deleted successfully",
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