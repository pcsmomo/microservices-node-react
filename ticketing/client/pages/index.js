const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// export async function getServerSideProps() {
//   console.log('I am on the server');
//   return { props: { color: 'red' } };
// }

// getServerSideProps can replace getIinitialProps as getIinitialProps is considered as a legacy method
// But leave it for now to see the usecase of getIinitialProps
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // console.log('LANDING PAGE');
  // const client = buildClient(context);
  // const { data } = await client.get('/api/users/currentuser');
  // return data;

  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
