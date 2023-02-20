const LandingPage = ({ color }) => {
  console.log('I am in the component', color);

  return <h1>Landing Page</h1>;
};

// export async function getServerSideProps() {
//   console.log('I am on the server');

//   return { props: { color: 'red' } };
// }

// getServerSideProps can replace getIinitialProps as getIinitialProps is considered as a legacy method
// But leave it for now to see the usecase of getIinitialProps
LandingPage.getInitialProps = () => {
  console.log('I am on the server');

  return { color: 'red' };
};

export default LandingPage;
