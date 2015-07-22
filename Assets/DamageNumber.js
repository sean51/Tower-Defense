public var color: Color = Color(0.8,0.8,0,1.0);
public var scroll: float = .2;
public var duration: float = 1.5;
public var alpha: float;
public var follow : Vector3;

function Start()
{
	GetComponent.<GUIText>().material.color = color;
	alpha = 1;
}

function Update()
{
	if (alpha > 0)
	{
		if(follow != null)
		{
			follow.y += scroll * Time.deltaTime;
			transform.position = Camera.main.WorldToViewportPoint(follow);
		}
		alpha -= Time.deltaTime/duration;
		GetComponent.<GUIText>().material.color.a = alpha;
	} 
	else 
	{
		Destroy(gameObject); // text vanished - destroy itself
	}
}

function linkObject(theObject : Vector3)
{
	follow = theObject;
}