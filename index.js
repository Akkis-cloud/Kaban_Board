const openModalButtonRef=document.querySelector('.quick-action .icon.add');
const modalRef=document.querySelector('.modal');
const closeModalButtonRef=document.querySelector('.modal .right-section .close');
const textareaRef=document.querySelector('.modal .left-section textarea');
const priorityBoxesRef=document.querySelectorAll('.modal .priority-filter .box');


const tasks=[];
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
        closeModal()
    }
});
closeModalButtonRef.addEventListener('click',()=>{
    closeModal();
})
textareaRef.addEventListener('keyup',(ev)=>{
    // console.log(ev.target.value);
    if(ev.key=="Shift")
    {
        const description=ev.target.value;
        const priority=getSlectedClassPriority();
        tasks.push({
            id:tasks.length+1,
            description:description,
            priority:priority
        })
        console.log(tasks);
        closeModal();
    }
})
function getSlectedClassPriority(){
    let priority='';
    priorityBoxesRef.forEach((singleBoxRef,idx)=>{
    if([...singleBoxRef.classList].includes('selected'))
    {
        priority=`p${idx+1}`;
    }
    });
    return priority;
}
function removeSlectedClassFromBox(){
    priorityBoxesRef.forEach((boxRef)=>{
boxRef.classList.remove('selected');
    })
}
function addSelectedClassToCurrentBox(boxRef){
    boxRef.classList.add('selected');
}
priorityBoxesRef.forEach((boxRef)=>{
    boxRef.addEventListener('click',(ev)=>{
       removeSlectedClassFromBox();
       addSelectedClassToCurrentBox(ev.target);
    })
})