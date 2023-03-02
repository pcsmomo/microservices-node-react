process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import axios from 'axios';

const cookie =
  'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwTURFd05Ua3hORE14WXpBMFpHWTROekEyT0dKaFlpSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRZM056YzVNVGs0TTMwLnNoX0Fiam9lR3NEaHBxNk5DWFhQeXJrRnUxbXFsNFJqcE5Hc0VRRC1KWkUifQ==';

const doRequest = async () => {
  const { data } = await axios.post(
    'https://ticketing.dev/api/tickets',
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );
};

for (let i = 0; i < 200; i++) {
  doRequest();
  console.log(`Done #${i + 1}`);
}
