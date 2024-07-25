import "./How.css";

function How() {
    return (
        <section className="how-it-works">
            <div className="container">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Create Your Profile</h3>
                        <p>
                            Sign up and set up your personal profile in a few
                            easy steps.
                        </p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Setup Your Interview</h3>
                        <p>
                            Set the interview parameters such as pace,
                            questions, and more.
                        </p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Start Practicing</h3>
                        <p>
                            Interact with our AI bot to simulate real interview
                            conditions.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default How;
