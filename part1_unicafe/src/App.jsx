/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import { useState } from 'react'

const Button = ({handleGoodBtn, handleNeutralBtn, handleBadBtn}) => {
	return (
		<>
			<h2>Give Feedback</h2>
			<button onClick={handleGoodBtn}>Good</button>  
			<button onClick={handleNeutralBtn}>Neutral</button>
			<button onClick={handleBadBtn}>Bad</button>
		</>
	)
}

const Statistics = ({goodCount, neutralCount, badCount, total, AverageScore, positivePercentage}) => {
	const StatisticLine = ({text, value}) => {
		return (
			<tr>
                <td>{text}</td>
                <td>{value}</td>
            </tr>
		)
	}
	
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
            <table>
                <tbody>
                    <StatisticLine text='good' value={goodCount} />
                    <StatisticLine text='neutral' value={neutralCount} />
                    <StatisticLine text='bad' value={badCount} />
                    <StatisticLine text='all' value={total} />
                    <StatisticLine text='Average' value={AverageScore} />
                    <StatisticLine text='positive' value={`${positivePercentage} %`} />
                </tbody>
            </table>
		</>
	)
}
const Anecdotes = ({ mostVotedAnecdote, mostNumOfVotes, anecdoteSelectedStatus,selectedAnecdote, anecdoteCount, handleAnecdoteIndexBtn, handleAnecdoteVoteBtn }) => {
	if (!anecdoteSelectedStatus) {
		return (
			<>
				<button onClick={handleAnecdoteIndexBtn}>Click here for some anecdotes</button>
			</>
		)
	}
	
	return (
		<>
			<h2>Anecdote of the day</h2>
			<p>{selectedAnecdote}</p>
			<p>{anecdoteCount} votes</p>
			<button onClick={handleAnecdoteIndexBtn}>Change anecdote</button>
			<button onClick={handleAnecdoteVoteBtn}>Vote</button>

			<h2>Anecdote with most votes</h2>
			<p>{mostVotedAnecdote}</p>
			<p>{ mostNumOfVotes} votes</p>
		</>
	)
	// button, then selected anecdote, then anecdote count followed by vote button

}

const App = () => {
	// need total
	const [selected, setSelected] = useState({ index: null, anecdoteSelectedStatus:false});
	const [anecdoteData, setAnecdoteData] = useState([
		{ anecdote: 'If it hurts, do it more often.', votes: 0 },
		{ anecdote: 'Adding manpower to a late software project makes it later!', votes: 0 },
		{ anecdote: 'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.', votes: 0 },
		{ anecdote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', votes: 0 },
		{ anecdote: 'Premature optimization is the root of all evil.', votes: 0 },
		{ anecdote: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.', votes: 0 },
		{ anecdote: 'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.', votes: 0 },
		{ anecdote: 'The only way to go fast, is to go well.', votes: 0 }
	]);
	const [anecdoteStats, setStat] = useState(
		{ mostVotedAnecdote: null,
			mostNumOfVotes: 0}
	)

	const handleAnecdoteIndexBtn = () => {
		const copiedSelected = {...selected}
		let randomNumber = Math.floor(Math.random() * anecdoteData.length);
		copiedSelected.index = randomNumber;
		copiedSelected.anecdoteSelectedStatus = true;
		setSelected(copiedSelected);
	};

	const handleAnecdoteVoteBtn = () => {
		// create a copy of the anecdoteData array
		const newAnecdoteData = [...anecdoteData];
		// update the specific property
		newAnecdoteData[selected.index].votes += 1;
		setAnecdoteData(newAnecdoteData);

		// update the index to anecdoteStats
		// Compute the most-voted anecdote
        let mostVotedAnecdote = null;
		let mostNumOfVotes = 0;
		newAnecdoteData.forEach((eachAnecdote) => {
            if (eachAnecdote.votes > mostNumOfVotes) {
                mostNumOfVotes = eachAnecdote.votes;
                mostVotedAnecdote = eachAnecdote.anecdote;
            }
        });

        // Update anecdote stats
        setStat(prevAnecdoteStats => {
            return {
                ...prevAnecdoteStats,
                mostVotedAnecdote,
                mostNumOfVotes,
            };
        });
	};

	const [good, setGood] = useState({ count: 0, score: 1 });
	const [neutral, setNeutral] = useState({ count: 0, score: 0 });
	const [bad, setBad] = useState({ count: 0, score: -1 });
	const [total, setTotal] = useState(0);
	const [average, setAverage] = useState(0);
	const [positiveFeedbackPercentage, setPercentage] = useState(0);

	const handleGoodBtn = () => {
		const updatedGoodCount = good.count + 1;
		const newClicks = { ...good, count: updatedGoodCount };
		setGood(newClicks);
		const newTotal = updatedGoodCount + neutral.count + bad.count;
		setTotal(newTotal);
		setAverage((updatedGoodCount * good.score + bad.count * bad.score) / newTotal);
		setPercentage((updatedGoodCount / newTotal) * 100);
	};

	const handleNeutralBtn = () => {
		const updatedNeutralCount = neutral.count + 1;
		const newClicks = { ...neutral, count: updatedNeutralCount };
		setNeutral(newClicks);
		const newTotal = good.count + updatedNeutralCount + bad.count;
		setTotal(newTotal);
		setAverage((good.count * good.score + bad.count * bad.score) / newTotal);
		setPercentage((good.count / newTotal) * 100);
	};

	const handleBadBtn = () => {
		const updatedBadCount = bad.count + 1;
		const newClicks = { ...bad, count: updatedBadCount };
		setBad(newClicks);
		const newTotal = good.count + neutral.count + updatedBadCount;
		setTotal(newTotal);
		setAverage((good.count * good.score + updatedBadCount * bad.score) / newTotal);
		setPercentage((good.count / newTotal) * 100);
	};

	return (
		<div>
			<Anecdotes
				anecdoteSelectedStatus = {selected.anecdoteSelectedStatus}
				selectedAnecdote={selected.index!==null? anecdoteData[selected.index].anecdote :null}
				anecdoteCount= {selected.index!==null? anecdoteData[selected.index].votes: null}
				handleAnecdoteIndexBtn={handleAnecdoteIndexBtn}
				handleAnecdoteVoteBtn={handleAnecdoteVoteBtn}
				mostVotedAnecdote = {anecdoteStats.mostVotedAnecdote!==null?anecdoteStats.mostVotedAnecdote:null}
				mostNumOfVotes = {anecdoteStats.mostNumOfVotes}
			/>
			<Button handleGoodBtn={handleGoodBtn} handleNeutralBtn={handleNeutralBtn} handleBadBtn={handleBadBtn} />
			<Statistics
				goodCount={good.count}
				neutralCount={neutral.count}
				badCount={bad.count}
				total={total}
				AverageScore={average}
				positivePercentage={positiveFeedbackPercentage}
			/>
		</div>
	);
};

export default App