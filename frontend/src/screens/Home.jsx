import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState('')
    const [ project, setProject ] = useState([])
    const [ error, setError ] = useState('')

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        setError('')

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                setIsModalOpen(false)
                setProjectName('')
                setError('')
                const createdProject = res.data.project || res.data
                setProject(prev => [...prev, createdProject])
                navigate('/project', {
                    state: { project: createdProject }
                })
            })
            .catch((err) => {
                console.error("Error creating project:", err.response?.data || err)
                const errorMsg =
                    err.response?.data?.error ||
                    (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
                    err.response?.data?.message ||
                    "Failed to create project"
                setError(errorMsg)
            })
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)

        }).catch(err => {
            console.log(err)
        })

    }, [])


    return (
        <main className='p-4'>
            <div className="projects flex flex-wrap gap-3">
                <button
                    onClick={() => {
                        setError('')
                        setProjectName('')
                        setIsModalOpen(true)
                    }}
                    className="project p-4 border border-slate-300 rounded-md">
                    New Project
                    <i className="ri-link ml-2"></i>
                </button>

                {
                    project.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project }
                                })
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200">
                            <h2
                                className='font-semibold'
                            >{project.name}</h2>

                            <div className="flex gap-2">
                                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                                {project.users?.length || 0}
                            </div>

                        </div>
                    ))
                }


            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                        <h2 className="text-xl mb-4 font-semibold">Create New Project</h2>
                        {error && (
                            <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
                                {error}
                            </div>
                        )}
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    onChange={(e) => {
                                        setProjectName(e.target.value)
                                        if (error) setError('')
                                    }}
                                    value={projectName}
                                    type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => {
                                    setIsModalOpen(false)
                                    setError('')
                                }}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </main>
    )
}

export default Home