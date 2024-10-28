const Root = () => {
  return (
    <>
      <div className="container flex-row space-y-10">
        <h1>Bridge</h1>

        <nav>
          <ul className="space-y-5">
            <li>
              <a href={`/admin`}>Cell Page</a>
            </li>
            <li>
              <a href={`/fam`}>Fam Page</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Root;
