const Header = (courses) => {
	return (
		<div>
			<p>{courses.courseName}</p>
		</div>
	)
}

const Part1 = ({ex1Name, ex1Num}) => {
	return (
		<p>
			{ex1Name} {ex1Num}
		</p>
	)
}

const Part2 = ({ex2Name, ex2Num}) => {
	return (
		<p>
			{ex2Name} {ex2Num}
		</p>
	)
}

const Part3 = ({ ex3Name, ex3Num }) => {
	return (
		<p>
			{ex3Name} {ex3Num}
		</p>
	)
}

const Content = ({ ex1Name, ex1Num, ex2Name, ex2Num, ex3Name, ex3Num }) => {
	return (
		<>
			<p>
				<Part1 ex1Name = {ex1Name} ex1Num = {ex1Num} />
			</p>
			<p>
				<Part2 ex2Name = {ex2Name} ex2Num = {ex2Num} />
			</p>
			<p>
				<Part3 ex3Name = {ex3Name} ex3Num = {ex3Num} />
			</p>
		</>
	)
	
}

const Total = (totalExerciseNum) => {
	return (
		<>
			<p>Number of exercises: {totalExerciseNum.totalExercise}</p>
		</>
	)
}

const App = () => {
	const course = 'Half Stack application development'
	const part1 = 'Fundamentals of React'
	const exercises1 = 10
	const part2 = 'Using props to pass data'
	const exercises2 = 7
	const part3 = 'State of a component'
	const exercises3 = 14

	return (
		< div >
			<Header courseName={course} />
			
			<Content ex1Name={part1} ex1Num={exercises1}
				ex2Name={part2} ex2Num={exercises2}
				ex3Name = {part3} ex3Num = {exercises3} />

			<Total totalExercise = {exercises1 + exercises2 + exercises3} />
			
		</div >
		)
}
	
export default App;
