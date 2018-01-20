import * as r from 'rethinkdb';

export async function upsert({collection, selector, data}, collections, send, errorHandle, dbConnection) {
  try {
    const conn = dbConnection.connection();
    const table = collections.get(collection).table;
    let query;
    if (typeof selector === 'string') {
      query = table.get(selector);
    } else {
      query = table.filter(selector);
    }

    const result: r.WriteResult = await query.replace(doc => {
      return r.branch(
        doc.eq(null),
        r.expr(data),
        doc.merge(data)
      )
    }).run(conn);

    const {first_error, ...other} = result;
    const res: Object[] = [];

    if (first_error) {
      throw new Error((first_error as any));
    } else {
      res.push(other);
    }

    send({
      state: 'complete',
      data: res
    })
  } catch (e) {
    errorHandle(e.message)
  }
}