import React from 'react';

function Page(props) {
  return <div className="flex flex-col h-full">{props.children}</div>;
}

export default Page;
