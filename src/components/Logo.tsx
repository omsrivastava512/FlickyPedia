import logo from '/logo.png?url'

export function Logo() {
  return (
    <div className="logo">
      <span role="img"><img src={logo} width="40vw" alt="" draggable="false" onContextMenu={e => e.preventDefault()} /></span>
      <h1>FlickyPedia</h1>
    </div>
  );
}
