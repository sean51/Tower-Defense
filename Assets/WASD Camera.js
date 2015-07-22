#pragma strict

private var left : boolean = false;
private var right : boolean = false;
private var up : boolean = false;
private var down : boolean = false;

private var timer : float = 5.0f;

function Update () 
{
	if(Input.GetButtonDown("Left"))
	{
		left = true;
	}
	if(Input.GetButtonDown("Right"))
	{
		right = true;
	}
	if(Input.GetButtonDown("Up"))
	{
		up = true;
	}
	if(Input.GetButtonDown("Down"))
	{
		down = true;
	}
	if(Input.GetButtonUp("Left"))
	{
		left = false;
	}
	if(Input.GetButtonUp("Right"))
	{
		right = false;
	}
	if(Input.GetButtonUp("Up"))
	{
		up = false;
	}
	if(Input.GetButtonUp("Down"))
	{
		down = false;
	}
	if (Input.GetAxis("Mouse ScrollWheel") < 0)
	{
		if(gameObject.transform.position.y < 20)
		{
			gameObject.transform.Translate(Vector3(0, 1, -1), Space.World);
			gameObject.transform.Rotate(Vector3(-2, 0, 0));
		}
	}
	if (Input.GetAxis("Mouse ScrollWheel") > 0)
	{
		if(gameObject.transform.position.y > 4)
		{
			gameObject.transform.Translate(Vector3(0, -1, 1), Space.World);
			gameObject.transform.Rotate(Vector3(2, 0, 0));
		}
	}
	if(left)
	{
		//timer += Time.deltaTime;
		gameObject.transform.Translate(Vector3(-1, 0, 0) * Time.deltaTime * timer, Space.World);
	}
	if(right)
	{
		//timer += Time.deltaTime;
		gameObject.transform.Translate(Vector3(1, 0, 0) * Time.deltaTime * timer, Space.World);
	}
	if(up)
	{
		//timer += Time.deltaTime;
		gameObject.transform.Translate(Vector3(0, 0, 1) * Time.deltaTime * timer, Space.World);
	}
	if(down)
	{
		//timer += Time.deltaTime;
		gameObject.transform.Translate(Vector3(0, 0, -1) * Time.deltaTime * timer, Space.World);
	}
	/*
	else if(!left && !right && !up)
	{
		timer = 2.0f;
	}
	*/
}