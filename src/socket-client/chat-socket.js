const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
  socket.emit('message', { data: message.value });
  document.getElementById('message').value = '';
};

socket.on('message', ({ data }) => {
  handleNewMessage(data);
});

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
  items = document.querySelectorAll('.chat-item  > li');
  console.log(items);
  last = items[items.length - 1];
  last.scrollIntoView();
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message));

  return li;
};
