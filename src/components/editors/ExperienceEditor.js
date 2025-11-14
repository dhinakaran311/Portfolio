
import React, { useState } from 'react';
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ExperienceEditor = ({ experiences, onAdd, onUpdate, onDelete }) => {
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddExp = (e) => {
    e.preventDefault();
    onAdd(newExp);
    setNewExp({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
  };

  const handleUpdateExp = (e) => {
    e.preventDefault();
    onUpdate(editingId, newExp);
    setEditingId(null);
    setNewExp({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setNewExp({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
    });
  };

  return (
    <motion.div
      id="experience-editor"
      className="editor-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="editor-title">
        {editingId ? "Edit Experience" : "Add New Experience"}
      </h3>
      <form onSubmit={editingId ? handleUpdateExp : handleAddExp}>
        <div className="editor-grid">
          <div className="editor-group">
            <label>Role</label>
            <input
              type="text"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="editor-input"
              required
            />
          </div>
          <div className="editor-group">
            <label>Company</label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              className="editor-input"
              required
            />
          </div>
        </div>

        <div className="editor-group">
          <label>Duration</label>
          <input
            type="text"
            value={newExp.duration}
            onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
            className="editor-input"
            placeholder="e.g. Jan 2023 - Present"
            required
          />
        </div>

        <div className="editor-group">
          <div className="markdown-editor-container">
            <div className="markdown-column">
              <label>Description (Markdown)</label>
              <textarea
                value={newExp.description}
                onChange={(e) =>
                  setNewExp({ ...newExp, description: e.target.value })
                }
                className="editor-input markdown-input"
                rows="8"
                placeholder="Enter markdown here..."
                required
              />
            </div>
            <div className="markdown-column">
              <label>Preview</label>
              <div className="markdown-preview-container">
                <div className="markdown-preview">
                  {newExp.description ? (
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="markdown-h1" {...props}>{props.children}</h1>,
                        h2: ({node, ...props}) => <h2 className="markdown-h2" {...props}>{props.children}</h2>,
                        h3: ({node, ...props}) => <h3 className="markdown-h3" {...props}>{props.children}</h3>,
                        p: ({node, ...props}) => <p className="markdown-p" {...props}>{props.children}</p>,
                        a: ({node, ...props}) => <a className="markdown-a" {...props}>{props.children}</a>,
                        ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
                        ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
                        li: ({node, ...props}) => <li className="markdown-li" {...props} />,
                        code: ({node, inline, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <div className="markdown-code-block">
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match ? match[1] : 'javascript'}
                                PreTag="div"
                                customStyle={{ margin: 0, padding: '1em' }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className="markdown-inline-code" {...props}>
                              {children}
                            </code>
                          );
                        },
                        blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
                      }}
                    >
                      {newExp.description}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted">Markdown preview will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="editor-actions">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewExp({
                  role: "",
                  company: "",
                  duration: "",
                  description: "",
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn">
            {editingId ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      </form>

      <h3 className="editor-title">Current Experiences</h3>
      <div className="table-container">
        <table className="experience-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.role}</td>
                <td>{exp.company}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="edit-table-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(exp.id)}
                      className="delete-table-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ExperienceEditor;
