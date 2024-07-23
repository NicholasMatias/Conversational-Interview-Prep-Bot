import './InterviewFeedback.css'
import { Tooltip } from 'react-tooltip'
import Spacing from '../landing_page/spacing/Spacing';


const InterviewFeedback = ({ messagesPass, isOpen, onClose, freqWords, freqPhrases }) => {

    if (!isOpen) return null;

    const colors = {
        0: '#ff0a0a',
        last: '#ff0a0a',
        fourth: '#f2ce02',
        third: '#85e62c',
        second: '#209c05',
        best: '#00FF00'
    }





    return (
        <div className="overlay ">
            <div className="transcript-modal-container">
                <div>
                    <h1>Interview Feedback</h1>
                </div>
                <Spacing/>
                
                <div className='freq-main'>
                    <div className='freq-header-container'>
                        <h3 className='freq-header'>Most Frequently Used Words and Phrases</h3>
                    </div>
                    <div className='freq-container'>
                        {
                            freqWords.length > 0 ? freqWords.map((word, index) => {
                                return (
                                    <h3 className='freq-word'>{word[0]}: {word[1]}</h3>
                                )
                            })
                                :
                                <div>

                                </div>
                        }
                        {
                            freqPhrases.length > 0 ? freqPhrases.map((word, index) => {
                                return (
                                    <h3 className='freq-word'>{word[0]}: {word[1]}</h3>
                                )
                            })
                                :
                                <div>

                                </div>
                        }
                    </div>
                </div>


                <div>
                    {messagesPass.length > 0 ? messagesPass?.map((message, index) => {
                        return (
                            <div className="messages-container" key={index}>

                                <div className='header-container'>
                                    <h3 className='messages-transcript message-role'>
                                        {(message.role === "bot" ? `Interviewer:` :
                                            `You:`)}
                                    </h3>
                                    {message.role === "bot" ?
                                        <div></div>
                                        :
                                        <div className='STAR-container'>
                                            <div style={{ backgroundColor: colors[message.situation] }} className='star' >S</div>
                                            <div style={{ backgroundColor: colors[message.task] }} className='star'>T</div>
                                            <div style={{ backgroundColor: colors[message.action] }} className='star'>A</div>
                                            <div style={{ backgroundColor: colors[message.result] }} className='star'>R</div>
                                            <div style={{ backgroundColor: colors[message.relevance] }} className='relevance'>Relevance</div>
                                        </div>
                                    }
                                </div>

                                <pre className='messages-transcript'>{message.content.trim()}</pre>

                            </div>
                        )

                    }) :
                        <h1>No text in this transcript.</h1>}

                </div>

                <button className='feedback-btn' onClick={onClose}>Close</button>
            </div>

        </div>
    )
}

export default InterviewFeedback