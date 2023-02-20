import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get('/api/users/currentuser').catch(err => {
    console.log(err.message);
  });

  return <h1>Landing Page</h1>;
};

// export async function getServerSideProps() {
//   console.log('I am on the server');

//   return { props: { color: 'red' } };
// }

// getServerSideProps can replace getIinitialProps as getIinitialProps is considered as a legacy method
// But leave it for now to see the usecase of getIinitialProps
// LandingPage.getInitialProps = async () => {
//   const response = await axios.get('/api/users/currentuser');

//   return { color: 'red' };
// };

export default LandingPage;
