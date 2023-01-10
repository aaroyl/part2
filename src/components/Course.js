const Course = (props) => {
    const {course} = props
    let total = course.parts.reduce((tot, part) => tot + part.exercises, 0)
    return(
      <div>
        <h1>{course.name}</h1>
        <ul>
          {course.parts.map(part =>
            <li key={part.id}>{part.name} {part.exercises}</li>
          )}
        </ul>
        <b>total of {total} exercises</b>
      </div>
    )
  }

export default Course
