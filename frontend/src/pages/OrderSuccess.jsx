import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {

    const { id } = useParams();

    return (
        <div className="success-page">

            <h2>🎉 Order Successful!</h2>

            <p>Your order #{id} has been placed.</p>

            <Link to="/">
                Continue Shopping
            </Link>

            <br />

            <Link to="/admin/orders">
                View Orders
            </Link>

        </div>
    );
}