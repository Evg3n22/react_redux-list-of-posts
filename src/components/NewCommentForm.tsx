import classNames from 'classnames';
import React, { useState } from 'react';
import { CommentData } from '../types/Comment';

type Props = {
  // Ми залишаємо onSubmit як пропс, щоб форма була універсальною.
  // Вона просто очікує проміс, який ми даємо їй через .unwrap() у батька.
  onSubmit: (data: CommentData) => Promise<void>;
};

export const NewCommentForm: React.FC<Props> = ({ onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false); // Додамо для обробки помилок запиту

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    body: false,
  });

  const [{ name, email, body }, setValues] = useState({
    name: '',
    email: '',
    body: '',
  });

  const clearForm = () => {
    setValues({ name: '', email: '', body: '' });
    setErrors({ name: false, email: false, body: false });
    setHasError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name: field, value } = event.target;

    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: false }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Валідація
    const newErrors = {
      name: !name.trim(),
      email: !email.trim(),
      body: !body.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setSubmitting(true);
    setHasError(false);

    try {
      // Тут викликається dispatch(addComment(...)).unwrap() з PostDetails
      await onSubmit({ name, email, body });

      // Очищуємо лише текст коментаря, зберігаючи ім'я та пошту для зручності
      setValues(current => ({ ...current, body: '' }));
    } catch (error) {
      // Якщо сервер повернув помилку
      setHasError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} onReset={clearForm} data-cy="NewCommentForm">
      {/* Загальне повідомлення про помилку запиту */}
      {hasError && (
        <div className="notification is-danger" data-cy="ErrorMessage">
          {`Can't add a comment. Please try again later.`}
        </div>
      )}

      {/* Поле імені */}
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', { 'is-danger': errors.name })}
            value={name}
            onChange={handleChange}
            disabled={submitting}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
          {errors.name && (
            <span className="icon is-small is-right has-text-danger">
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.name && <p className="help is-danger">Name is required</p>}
      </div>

      {/* Поле Email */}
      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="email"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', { 'is-danger': errors.email })}
            value={email}
            onChange={handleChange}
            disabled={submitting}
          />
          <span className="icon is-small is-left" data-cy="ErrorIcon">
            <i className="fas fa-envelope" />
          </span>
          {errors.email && (
            <span className="icon is-small is-right has-text-danger">
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.email && <p className="help is-danger">Email is required</p>}
      </div>

      {/* Поле Тексту */}
      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>
        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': errors.body })}
            value={body}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
        {errors.body && <p className="help is-danger">Enter some text</p>}
      </div>

      {/* Кнопки */}
      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button', 'is-link', {
              'is-loading': submitting,
            })}
            disabled={submitting}
          >
            Add
          </button>
        </div>
        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            disabled={submitting}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
