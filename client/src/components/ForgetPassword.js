import { Link } from "react-router-dom"

const forgetPassword = () => {
    return (
        <section>
            <h1>Reset Password</h1>
            <br />
            <p>You must have been assigned an Admin role.</p>
            <div className="flexGrow">
                <Link to="/login">Home</Link>
            </div>
        </section>
    )
}

export default forgetPassword