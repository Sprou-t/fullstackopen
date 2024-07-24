import { useState } from 'react'

const Button = () => {
	
}

const Statistics = ({goodCount, neutralCount, badCount, total, AverageScore, positivePercentage}) => {
	if (total === 0) {
		return (
			<>
				<h2>Statistics</h2>
				<p>No feedback given</p>
			</>
		)
	}

	return (
		<>
			<h2>Statistics</h2>
			<p>good {goodCount}</p>
			<p>neutral {neutralCount} </p>
			<p>bad {badCount} </p>
			<p>all {total} </p>
			<p>Average {AverageScore}</p>
			<p>positive {positivePercentage}% </p>

		</>
	)
}

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState({
		count:0, score:1
	})
	const [neutral, setNeutral] = useState({
		count:0, score:0
	})
	const [bad, setBad] = useState({
		count:0, score:-1
	})
	const [total, setTotal] = useState(0)
	const [average, setAverage] = useState(0)
	const [positiveFeedbackPercentage, setPercentage] = useState(0)
	
	const handleGoodBtn = () => {
		const updatedGoodCount = good.count + 1 // dynamic calculation
		const newClicks = {
			count: updatedGoodCount,
			score: good.score
		}
		setGood(newClicks)
		setTotal(updatedGoodCount + neutral.count + bad.count)
		setAverage((updatedGoodCount*good.score + bad.count*bad.score)/(updatedGoodCount + neutral.count + bad.count))
		setPercentage(updatedGoodCount/(updatedGoodCount + neutral.count+ bad.count)*100)
	}

	const handleNeutralBtn = () => {
		const updatedNeutralCount = neutral.count + 1
		const newClicks = {
			count: updatedNeutralCount,
			score: neutral.score
		}
		setNeutral( newClicks)
		setTotal(good.count + updatedNeutralCount + bad.count)
		setAverage((good.count*good.score + bad.count*bad.score)/(good.count + updatedNeutralCount + bad.count))
		setPercentage(good.count/(good.count + updatedNeutralCount+ bad.count)*100)
	}

	const handleBadBtn = () => {
		const updatedBadCount = bad.count + 1
		const newClicks = {
			count: updatedBadCount,
			score: bad.score
		}
		setBad(newClicks)
		setTotal(good.count + neutral.count + updatedBadCount)
		setAverage((good.count*good.score + updatedBadCount*bad.score)/(good.count + neutral.count + updatedBadCount))
		setPercentage(good.count/(good.count + neutral.count+ updatedBadCount)*100)
	}
  return (
    <div>
		<h2>Give Feedback</h2>
		<button onClick={handleGoodBtn}>Good</button>  
		<button onClick={handleNeutralBtn}>Neutral</button>
		<button onClick={handleBadBtn}>Bad</button>
		
		  <Statistics goodCount={good.count} neutralCount={neutral.count} badCount={bad.count}
			  total={ total} AverageScore={average} positivePercentage={positiveFeedbackPercentage} />
    </div>
  )
}

export default App