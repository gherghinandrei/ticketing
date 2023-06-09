import Router from 'next/router';
import { useEffect, useState, uses } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => {
      Router.push('/orders');
    }
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeft / 1000));
    }
    findTimeLeft();



    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    }

  }, [order]);


  if (timeLeft < 0) {
    return <div>Order Expired</div>;

  }
  return <div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout
      token={({ id }) => doRequest({ token: id })}
      stripeKey='pk_test_51NCpgNGFQJHQDO5MlRhK0vXxrdtHPPTpcL8yOMe3RpKzYUKyxBOgrjzLJkkfe1LZv7xt7duuuIhGMg9FmJkbje5I00Te9RLkuL'
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>;
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;