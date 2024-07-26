const Header = ({name}) => {
	return (
		<h2>{name}</h2>
	)
}
	
const Content = ({ parts }) => {
	// array would be iterated and for each iteratiton total exercise no. added to total and result is returned
	const sumOfExercises = parts.reduce((total, part) => {
		console.log(`${total} & ${ part } `)
		return total + part.exercises;
	},0)
	return (
		<>
			{parts.map(part =>
				<p key={part.id}>{part.name} { part.exercises}</p>
			)}
			<p>total of { sumOfExercises} exercises</p>

		</>
	)
}

const Course = ({ courses }) => {
	
	return (
		<>
      {courses.map((course) => (
        <div key={course.id}>
          <Header name={course.name} />
          <Content parts={course.parts} />
        </div>
      ))}
    </>
	)
}

export default Course