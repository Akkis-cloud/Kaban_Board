const openModalButtonRef=document.querySelector('.quick-action .icon.add');
const modalRef=document.querySelector('.modal');
const closeModalButtonRef=document.querySelector('.modal .right-section .close');
const textareaRef=document.querySelector('.modal .left-section textarea');
const priorityBoxesRef=document.querySelectorAll('.modal .priority-filter .box');
const ticketSectionRef=document.querySelector('.ticket-section');
const deleteDivRef=document.querySelector('.quick-action .icon.delete');
const deleteIconRef=document.querySelector('.quick-action .icon.delete .fa-trash');
const priorityFilterRef=document.querySelector('.priority-filter');
const clearFilterRef=document.querySelector('.clear-filter');
var uid = new ShortUniqueId();
let tasks;
function initializeLocalStorage() {
    tasks=getTasksFromLocalStorage();
    if(!tasks)
    {
        updateTasksInLocalStorage([
            {
                id:uid.rnd(),
                description:'task 1',
                priority:'p1'
            },
            {
                id:uid.rnd(),
                description:'task 2',
                priority:'p2'
            },
            {
                id:uid.rnd(),
                description:'task 3',
                priority:'p3'
            }
    ]);
    tasks=getTasksFromLocalStorage();
    listTickets(tasks);
    }
}
initializeLocalStorage();
const newTask={
    id:'',
    description:'',
    priority:''
};
// [
//     {
//         id:'',
//         description:'',
//         priority:''
//     },
//     {
//         id:'',
//         description:'',
//         priority:''
//     }
// ]
function openModal() {
    modalRef.classList.remove('hide');
}
function closeModal() {
    modalRef.classList.add('hide');
}
openModalButtonRef.addEventListener('click',()=>{
    const isHideClassApplied=[...modalRef.classList].includes('hide');
    if(isHideClassApplied)
    {
        openModal();
    }
    else
    {
        closeModal();
    }
});
closeModalButtonRef.addEventListener('click',()=>{
    closeModal();
});
textareaRef.addEventListener('keyup',(ev)=>{
    // console.log(ev.target.value);
    if(ev.key=="Shift")
    {
        const description=ev.target.value;
        const priority=getSlectedClassPriority();
        tasks.push({
            id:uid.rnd(),
            description:description,
            priority:priority
        })
        console.log(tasks);
        listTickets(tasks); 
        updateTasksInLocalStorage(tasks);
        closeModal();
    }
});
function getSlectedClassPriority(){
    let priority='';
    priorityBoxesRef.forEach((singleBoxRef,idx)=>{
    if([...singleBoxRef.classList].includes('selected'))
    {
        priority=`p${idx+1}`;
    }
    });
    return priority;
};
function removeSlectedClassFromBox(){
    priorityBoxesRef.forEach((boxRef)=>{
boxRef.classList.remove('selected');
    })
};
function addSelectedClassToCurrentBox(boxRef){
    boxRef.classList.add('selected');
};
priorityBoxesRef.forEach((boxRef)=>{
    boxRef.addEventListener('click',(ev)=>{
       removeSlectedClassFromBox();
       addSelectedClassToCurrentBox(ev.target);
    })
});
function createTicket(ticket) {
    return `
    <div class="ticket-priority" data-priority=${ticket.priority}></div>
    <div class="ticket-id">${ticket.id}</div>
    <div class="ticket-content">
    <textarea disabled>${ticket.description}</textarea>
    </div>
    <div class="ticket-lock locked">
    <i class="fa-solid fa-lock"></i>
    <i class="fa-solid fa-lock-open"></i>
    </div>
    <div class="ticket-delete">
    <i class="fa-solid fa-trash"></i>
    </div>
`; 
}
function clearList() {
    ticketSectionRef.innerHTML='';
}
function listTickets(tickets) {
    clearList();
    tickets.forEach((ticket)=>{
        const ticketHTML=createTicket(ticket);
        const ticketContainerRef=document.createElement('div');
        ticketContainerRef.setAttribute('class','ticket-container');
        ticketContainerRef.setAttribute('data-id',ticket.id);
        ticketContainerRef.innerHTML=ticketHTML;
        ticketSectionRef.appendChild(ticketContainerRef);
        const textAreaRef=ticketContainerRef.querySelector('.ticket-content textarea');
        textAreaRef.addEventListener('blur',(ev)=>{
            //blur listener work in case of forms only like input textarea like if we click outside the 
            //box it give details of box
            const currentTicketContainerRef=ev.target.closest('.ticket-container');
        const currentTicketId=currentTicketContainerRef.getAttribute('data-id');
        updateTaskDescription(currentTicketId,textAreaRef.value);
        console.log(currentTicketId);
        });
    });
}
function updateTaskDescription(id,updatedDescription) {
    const selectedTask=tasks.find((task)=>task.id===id);
    selectedTask.description=updatedDescription;
    updateTasksInLocalStorage(tasks);
}
listTickets(tasks); 

ticketSectionRef.addEventListener('click',(ev)=>{
    if([...ev.target.classList].includes('fa-lock'))
    {
        const currentTicketContainerRef=ev.target.closest('.ticket-container');
        //bubbling in which going up to look class ticket-container
        const currentTextAreaRef=currentTicketContainerRef.querySelector('.ticket-content textarea');
        const lockRef=currentTicketContainerRef.querySelector('.ticket-lock');
        const isEditable=lockRef.classList.contains('locked');
        if(isEditable){
            lockRef.classList.remove('locked');
            currentTextAreaRef.removeAttribute('disabled');
            //disabled restrict editing
        }
        else{
            lockRef.classList.add('locked');
            currentTextAreaRef.setAttribute('disabled',true);
        }
    }
    if([...ev.target.classList].includes('fa-trash'))
    {
        const currentTicketContainerRef=ev.target.closest('.ticket-container');
        const taskId=currentTicketContainerRef.getAttribute('data-id');
        deleteTask(taskId);
        listTickets(tasks);
    }
    if(ev.target.classList.contains('ticket-priority'))
    {
        changePriority(ev.target)
    }
})
function deleteTask(taskId) {
    tasks=tasks.filter(task=> task.id!==taskId); 
    updateTasksInLocalStorage(tasks);
}
function updateTasksInLocalStorage(tasks) {
    localStorage.setItem('tasks',JSON.stringify(tasks));

}
function getTasksFromLocalStorage(tasks) {
    const tasksData=localStorage.getItem('tasks');
    return tasksData ? JSON.parse(tasksData):undefined;
    // localStorage.getItem('tasks',JSON.stringify(tasks));
}
deleteDivRef.addEventListener('click',(ev)=>{
    const isDeleteEnabled=ev.currentTarget.classList.contains('enabled');
    if(!isDeleteEnabled)
    {
        ev.currentTarget.classList.add('enabled');
        ticketSectionRef.classList.add('enabled-delete');
    }
    else{
        ev.currentTarget.classList.remove('enabled');
        ticketSectionRef.classList.remove('enabled-delete');
    }
});
priorityFilterRef.addEventListener('click',(ev)=>{
    if(ev.target.classList.contains('box'))
    {
        const selectedPriority=ev.target.id;
        const filteredTasks=tasks.filter(task=>task.priority===selectedPriority);
        listTickets(filteredTasks);
    }
});
clearFilterRef.addEventListener('click',(ev)=>{
    listTickets(tasks);
})
function getNextPriority(priorityStr) {
    const priority= Number(priorityStr.split('p')[1]);
    const priorities=[1,2,3,4];
    return `p${(priority)%priorities.length+1}`;
    
}
function changePriority(domRef) {
    const currentPriority=domRef.getAttribute('data-priority');
        const currentTicketContainerRef=domRef.closest('.ticket-container');
        const taskId=currentTicketContainerRef.getAttribute('data-id');
        const nextPriority=getNextPriority(currentPriority);
        domRef.setAttribute('data-priority',nextPriority);
        impactedTask=tasks.find(task=>task.id===taskId);
        impactedTask.priority=nextPriority;
        updateTasksInLocalStorage(tasks);
}