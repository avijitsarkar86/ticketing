import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  }

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  }

  return (
    <div className='form-horizontal'>
      <h1>Create a Ticket</h1>

      <form onSubmit={onSubmit}>
        <div className='form-group' style={styles.marginTop}>

          <label>Title</label>
          <input
            value={title}
            className='form-control'
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group' style={styles.marginTop}>
          <label>Price</label>
          <input value={price} className='form-control' onBlur={onBlur} onChange={(e) => setPrice(e.target.value)} />
        </div>
        {
          errors &&
          <div style={styles.marginTop}>
            {errors}
          </div>
        }
        <button className='btn btn-primary' style={styles.marginTop}>Submit</button>
      </form>

    </div>
  );
}

const styles = {
  marginTop: { marginTop: '10px' }
}

export default NewTicket;