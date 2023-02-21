import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

// export async function getServerSideProps() {
//   console.log('I am on the server');
//   return { props: { color: 'red' } };
// }

// getServerSideProps can replace getIinitialProps as getIinitialProps is considered as a legacy method
// But leave it for now to see the usecase of getIinitialProps
LandingPage.getInitialProps = async context => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
