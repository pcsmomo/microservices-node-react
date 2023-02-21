import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  // axios.get('/api/users/currentuser').catch(err => {
  //   console.log(err.message);
  // });

  return <h1>Landing Page</h1>;
};

// export async function getServerSideProps() {
//   console.log('I am on the server');

//   return { props: { color: 'red' } };
// }

// getServerSideProps can replace getIinitialProps as getIinitialProps is considered as a legacy method
// But leave it for now to see the usecase of getIinitialProps
LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server
    // requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: {
          Host: 'ticketing.dev',
        },
      }
    );

    return data;
  } else {
    // we are on the browser
    // requests can be made with a base url of ''
    const { data } = await axios.get('/api/users/currentuser');

    // { currentUser: null }
    return data;
  }
  return {};
};

export default LandingPage;
