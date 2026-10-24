import { useEffect, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { EditorState, Prec } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { classHighlighter } from '@lezer/highlight';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

function languageExtension(language) {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'jsx':
      return javascript({ jsx: true });
    case 'html':
      return html();
    case 'css':
      return css();
    default:
      return [];
  }
}

// A CodeMirror 6 editor. The document lives in CodeMirror; `value` is pushed
// in only when it differs (reset, loading an old attempt), so typing never
// fights with React state.
export default function CodeEditor({ value, onChange, onRun, language, labelId, describedBy }) {
  const host = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    const view = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          drawSelection(),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          syntaxHighlighting(classHighlighter),
          EditorState.tabSize.of(2),
          Prec.highest(
            keymap.of([
              {
                key: 'Mod-Enter',
                run: () => {
                  onRunRef.current?.();
                  return true;
                },
              },
            ]),
          ),
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
          languageExtension(language),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            'aria-labelledby': labelId,
            ...(describedBy ? { 'aria-describedby': describedBy } : {}),
            spellcheck: 'false',
            autocorrect: 'off',
            autocapitalize: 'off',
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current?.(update.state.doc.toString());
          }),
        ],
      }),
    });
    viewRef.current = view;
    // Lets the end-to-end test set the editor's text.
    host.current.editorView = view;
    return () => view.destroy();
    // The editor is rebuilt only when the language changes; `value` syncs below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, labelId, describedBy]);

  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div className="editor" ref={host} data-testid="code-editor" />;
}
