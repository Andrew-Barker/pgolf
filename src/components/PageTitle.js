import { useEffect } from 'react';

function PageTitle(props) {
  useEffect(() => {
    document.title = `${props.title} | Natey C's Pub Golf`;
  }, [props.title]);

  return null;
}

export default PageTitle;
