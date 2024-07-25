import "./Contact.css";

function Contact() {
    return (
        <section className="contact-us" id="contact">
            <div className="contact-info">
                <h2>Contact Us</h2>
                <p>We're here to help you</p>
                <ul>
                    <li>
                        <i className="fa fa-envelope"></i>
                        <div className="title-specific">
                            <span>Email</span>
                            <a href="mailto:nicholasmatias.work@gmail.com">
                                InterviewMeSupport@gmail.com
                            </a>
                        </div>
                    </li>
                    <li>
                        <i className="fa fa-phone"></i>
                        <div className="title-specific">
                            <span>Phone</span>
                            <a href="tel:+15551234567">Some number</a>
                        </div>
                    </li>
                    <li>
                        <i className="fa fa-map-marker"></i>
                        <div className="title-specific">
                            <span>Location</span>
                            <address>Some address</address>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="contact-form">
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Your Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Your Message"
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </section>
    );
}

export default Contact;
