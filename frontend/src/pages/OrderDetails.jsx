import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/orderDetails.css";

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const token = localStorage.getItem("token");
    

    useEffect(() => {
        fetch(`http://localhost:3000/api/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(setOrder);
    }, [id]);
    console.log("ORDER:", order);
    if (!order) return <p>Loading...</p>;

   return (
    <div className="order-details">
        <div className="order-card-detail">

            {/* HEADER */}
            <div className="order-header-detail">
                <div className="order-id">Order #{order.id}</div>
                <div className={`order-status status-${order.status}`}>
                    {order.status}
                </div>
            </div>

            {/* CUSTOMER */}
            <div className="section">
                <h3>Customer</h3>
                <div className="customer-box">
                    <p>{order.user?.name}</p>
                    <p>{order.user?.email}</p>
                </div>
            </div>

            {/* ITEMS */}
            <div className="section">
                <h3>Items</h3>
               <div className="items-list">
    {(order.items || []).map((item, i) => {

        // const imagePath = item.images?.[0];

        // const imageUrl = imagePath
        //     ? imagePath.startsWith("http")
        //         ? imagePath
        //         : `http://localhost:3000${imagePath}`
        //     : null;
        const imageUrl = item.image
            ? item.image.startsWith("http")
                ? item.image
                : `http://localhost:3000${item.image}`
            : null;

        return (
            <div key={i} className="order-item">

                {/* IMAGE */}
                <div className="item-image">
                    {imageUrl ? (
                        <img src={imageUrl} alt={item.title} />
                    ) : (
                        <div className="no-image">No image</div>
                    )}
                </div>

                {/* INFO */}
                <div className="item-info">
                    <p className="item-title">{item.title}</p>
                    <p className="item-meta">
                        {item.quantity} × €{Number(item.price).toFixed(2)}
                    </p>
                </div>

            </div>
        );
    })}
</div>
            </div>

            {/* TOTAL */}
            <div className="order-total-detail">
                Total: €{Number(order.total).toFixed(2)}
            </div>

        </div>
    </div>
);
}