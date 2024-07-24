const Header = (courses) => {
	return (
		<div>
			<p>{courses.courseName}</p>
		</div>
	)
}

const Content = ({ parts }) => {
	const Part1 = ({parts}) => {
	return (
		<p>
			{parts[0].name} {parts[0].exercises}
		</p>
		)
	}

	const Part2 = ({parts}) => {
		return (
			<p>
				{parts[1].name} {parts[1].exercises}
			</p>
		)
	}

	const Part3 = ({parts}) => {
		return (
			<p>
				{parts[2].name} {parts[2].exercises}
			</p>
		)
	}
	
	return (
		<>
			<Part1 parts = {parts} />
			<Part2 parts = {parts} />
			<Part3 parts = {parts} />
		</>
	)
	
}

const Total = ({ parts }) => {
	return (
		<>
			<p>Number of exercises: {parts[0].exercises+parts[1].exercises+parts[2].exercises}</p>
		</>
	)
}

const App = () => {
	const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

	return (
		< div >
			<Header courseName={course.name} />
			
			<Content parts = {course.parts} />

			<Total parts={course.parts} />
		</div >
		)
}
	
export default App;
