import * as utils from './Skills.utils'

const Skills =(props) =>utils.graphOptions(props.Skills.names,props.Skills.ratings) |> utils.DrawSkillsPanel(props.container,props.Titles)

export default Skills;           