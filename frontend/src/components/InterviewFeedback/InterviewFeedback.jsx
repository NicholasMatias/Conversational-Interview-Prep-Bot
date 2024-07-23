import './InterviewFeedback.css'
import { act, useEffect, useState } from 'react';



const InterviewFeedback = ({ messagesPass, isOpen, onClose }) => {

    if (!isOpen) return null;





    for (let i = 0; i < messagesPass.length; i++) {
        console.log(`Message ${i}: ${messagesPass[i].result}`)
    }


    const colors = {
        0: '#ff0a0a',
        last: '#ff0a0a',
        fourth: '#f2ce02',
        third: '#85e62c',
        second: '#209c05',
        best: '#00FF00'
    }
    const textColors = ['#fff', '#fff', '#fff', '#fff', '#fff']





    return (
        <div className="overlay ">
            <div className="transcript-modal-container">
                <div>
                    <h1>Interview Feedback</h1>
                </div>


                <div>
                    {messagesPass.length > 0 ? messagesPass?.map((message, index) => {
                        return (
                            <div className="messages-container" key={index}>

                                <div className='header-container'>
                                    <h3 className='messages-transcript message-role'>
                                        {(message.role === "bot" ? `Interviewer (${index}):` :
                                            `You (${index}):`)}
                                    </h3>
                                    {message.role === "bot" ?
                                        console.log("Interview Turn")
                                        :
                                        console.log(
                                            `S: ${message.situation}
                                    T: ${message.task}
                                    A: ${message.action}
                                    R: ${message.result}
                                    Relevance: ${message.relevance}`
                                        )}
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