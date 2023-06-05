const Course = ({courses}) => {
    return(
    <div>
        {courses.map(course => 
        <div key={course.id}>
            <h1>{course.name}</h1>
            <Part parts={course.parts} />
            <Total parts={course.parts} />
        </div>
        )}
    </div>
    )
}
  
const Total = ({parts}) => {
  const sumExercises = parts.reduce((acc, curr) => acc + curr.exercises, 0);
  return(
    <b>
      Total of {sumExercises} exercises
    </b>
  )
}
  
const Part = ({parts}) => {
  return(
    <div>
      {parts.map(part =>
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      )}
    </div>
  )
}

export default Course
