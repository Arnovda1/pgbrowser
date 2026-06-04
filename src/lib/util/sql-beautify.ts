import type { EditorView } from "codemirror";
import { format } from "sql-formatter";

const beautifySql = (view?: EditorView) => {
  if (!view) return;
  const unformattedSQL = view.state.doc.toString();
  
  const formattedSQL = format(unformattedSQL, {
    language: 'postgresql',
    linesBetweenQueries: 2,
  });

  view.dispatch({
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: formattedSQL,
    },
  });
}

export default beautifySql;