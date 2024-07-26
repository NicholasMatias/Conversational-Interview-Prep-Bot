import "./Why.css";
import imageOne from "../images_icons/whyOne.png";
import imageTwo from "../images_icons/whyTwo.png";

function Why() {
    return (
        <section className="why-choose-us">
            <div className="content">
                <div className="text">
                    <h2>Why Choose Us</h2>
                    <p>Enhance Your Interview Skills</p>
                </div>
                <div className="features">
                    <div className="feature">
                        <img src={imageOne} alt="Personalized Feedback" />
                        <h3>Personalized Feedback</h3>
                        <p>
                            Receive detailed feedback to improve your responses.
                        </p>
                    </div>
                    <div className="feature">
                        <img src={imageTwo} alt="Flexible Practice" />
                        <h3>Flexible Practice</h3>
                        <p>Practice anytime, anywhere at your convenience.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Why;
