import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';

import { Message } from 'primereact/message';

import { parseAxiosError } from '../utils/network/parseAxiosError';

import config from '../config';
const { rootURI } = config;

const newPostRequestConfiguration = {
  url: `${rootURI}/posts`,
  method: 'POST',
  withCredentials: true,
};

const mapStateToProps = ({ isAuthenticated, user }) => ({
  isAuthenticated,
  user,
});


function PostForm({ toast, tags, posts, setPosts }) {
  const [formTags, setFormTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, errors, handleSubmit, reset } = useForm({
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  });


  const onSubmit = (formData) => {
    setLoading(true);
    axios({
      ...newPostRequestConfiguration,
      data: { ...formData, tags: formTags },
    })
      .then(({ data: newPost }) => {
        toast.current.show({
          sticky: true,
          severity: 'success',
          summary: `Post Submitted Successfully!`,
        });
        setPosts([newPost].concat(posts));
        setFormTags([]);
        reset();
      })
      .catch((err) => {
        const parsed = parseAxiosError(err).message;
        toast.current.show({
          sticky: true,
          severity: 'error',
          summary: 'Error Adding Post!',
          detail: parsed,
        });
      })
      .finally(() => setLoading(false));
  };

  const onAddTagsButtonClick = (e) => {
    e.preventDefault();
    const id = Number(e.target.dataset.id);
    if (isNaN(id)) {
      return toast.current.show({
        sticky: true,
        severity: 'error',
        summary: 'Tag has Unparseable ID',
        detail: 'Check Tag ID Type - Does not convert to Number',
      });
    }
    setFormTags(formTags.concat([id]));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" bg-white shadow-md rounded px-8 py-8 pt-8 m-8"
    >
      <div className="px-4 pb-4">
        <label htmlFor="title" className="text-sm block font-bold pb-2">
          Title
        </label>
        <input
          ref={register({
            required: { value: true, message: 'Title is Required' },
          })}
          type="title"
          name="title"
          id=""
          className="form-input"
          placeholder="Post Title"
        />
        {errors?.title?.message && (
          <Message severity="warn" text={errors.title.message} />
        )}
        <label htmlFor="content" className="text-sm block font-bold pb-2">
          Content
        </label>
        <textarea
          ref={register({
            required: { value: true, message: 'Content is Required' },
          })}
          type="content"
          name="content"
          id=""
          className="form-input"
          placeholder="Starbucks pumpkin spice mocha"
        />
        {errors?.content?.message && (
          <Message severity="warn" text={errors.title.message} />
        )}
      </div>
      <div>
        {tags.map(({ title, id }) => {
          const isSelected = formTags.includes(Number(id));
          return (
            <button
              key={id}
              className={classNames('btn mx-2', {
                'btn-toggled': isSelected,
              })}
              data-id={id}
              onClick={onAddTagsButtonClick}
            >
              {title}
            </button>
          );
        })}
      </div>
      <div>
        <input
          type="submit"
          className={classNames('btn', { 'btn-loading': loading })}
          value={loading ? 'Loading...' : 'Post'}
        />
      </div>
    </form>
  );
}

export default connect(mapStateToProps)(PostForm);
