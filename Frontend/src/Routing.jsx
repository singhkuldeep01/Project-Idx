import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateProject from './Pages/CreateProject'
import ProjectPlayground from './Pages/ProjectPlayground'

function Routing() {
  return (
    <Routes>
        <Route path='/' element = {<CreateProject/>}></Route>
        <Route path='/project/:projectId' element = {<ProjectPlayground/>}></Route>
    </Routes>
  )
}

export default Routing;