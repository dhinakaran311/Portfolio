import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../ProjectCard';
import ProjectsEditor from '../editors/ProjectsEditor';

const ProjectsSection = ({
    projects,
    isAdmin,
    addItem,
    updateItem,
    deleteItem,
    setRef
}) => {
    const renderProjects = () => {
        if (!projects || !Array.isArray(projects)) return null;
        return projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
        ));
    };

    return (
        <section
            id="projects"
            className="section section-bg"
            ref={(el) => setRef("projects", el)}
        >
            <div className="container">
                <div className="section-header">
                    <div className="projects-header">
                        <motion.h2
                            className="section-title"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            My <span>Projects</span>
                        </motion.h2>
                        <div className="section-subtitle">Explore my recent work</div>
                    </div>
                </div>

                {isAdmin && (
                    <ProjectsEditor
                        projects={projects}
                        onAdd={(newProject) => addItem("projects", newProject)}
                        onUpdate={(id, updatedProject) =>
                            updateItem("projects", id, updatedProject)
                        }
                        onDelete={(id) => deleteItem("projects", id)}
                    />
                )}

                <div className="projects-grid">{renderProjects()}</div>
            </div>
        </section>
    );
};

export default ProjectsSection;
