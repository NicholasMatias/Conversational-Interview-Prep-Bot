import './InterviewFeedback.css'
import Spacing from '../landing_page/spacing/Spacing';


const InterviewFeedback = ({ messagesPass, isOpen, onClose, freqWords, freqPhrases, scoreAverages }) => {

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
                <Spacing />

                <div className='average-container'>
                    <h3 className='star-header'>Average STAR Scores:</h3>
                    <div className='average-star-container'>
                        <div style={{ backgroundColor: colors[scoreAverages[0]] }} className='star-average' ><h3>Situation</h3></div>
                        <div style={{ backgroundColor: colors[scoreAverages[1]] }} className='star-average'><h3>Task</h3></div>
                        <div style={{ backgroundColor: colors[scoreAverages[2]] }} className='star-average'><h3>Action</h3></div>
                        <div style={{ backgroundColor: colors[scoreAverages[3]] }} className='star-average'><h3>Result</h3></div>
                    </div>
                    <div className='color-scale'>
                        <div className='color-titles'>
                            <h5 className='best-color'>Worst</h5>
                            <h5>={'>'}</h5>
                            <h5>={'>'}</h5>
                            <h5>={'>'}</h5>
                            <h5 className='worst-color'>Best</h5>
                        </div>
                        <div className='color-chart'>
                            <div className='color-value' style={{ backgroundColor: colors['last'] }}></div>
                            <div className='color-value' style={{ backgroundColor: colors['fourth'] }}></div>
                            <div className='color-value' style={{ backgroundColor: colors['third'] }}></div>
                            <div className='color-value' style={{ backgroundColor: colors['second'] }}></div>
                            <div className='color-value' style={{ backgroundColor: colors['best'] }}></div>

                        </div>
                    </div>
                </div>

                <div className='freq-main'>
                    <div className='freq-header-container'>
                        <h3 className='freq-header'>Most Frequently Used Words and Phrases</h3>
                    </div>
                    <div className='freq-container'>
                        {
                            freqWords.length > 0 ? freqWords.map((word, index) => {
                                return (
                                    <h3 key={index} className='freq-word'>{word[0]}: {word[1]}</h3>
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

                                        {message.role === "bot" ?
                                            <div></div>
                                            :
                                            <div className='STAR-container'>
                                                <div style={{ backgroundColor: colors[message.situation[0]] }} className='star' >S</div>
                                                <div style={{ backgroundColor: colors[message.task[0]] }} className='star'>T</div>
                                                <div style={{ backgroundColor: colors[message.action[0]] }} className='star'>A</div>
                                                <div style={{ backgroundColor: colors[message.result[0]] }} className='star'>R</div>
                                                <div style={{ backgroundColor: colors[message.relevance] }} className='relevance'>Relevance</div>
                                            </div>
                                        }
                                    </h3>
                                </div>
                                <div className='messages-transcript'>
                                    <pre className='messages-transcript-inner'>{message.content.trim()}</pre>
                                </div>
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