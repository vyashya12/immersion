import React from "react";

type ImageViewData = {
  id: number;
  url: string;
  description: string;
};

function ImageView({ dataList }: { dataList: ImageViewData[] }) {
  const items = dataList.map((item) => (
    <div key={item.id}>
      <img width={150} height={150} src={item.url} />
      <h6>{item.description}</h6>
    </div>
  ));
  return <>{items}</>;
}

export default ImageView;
