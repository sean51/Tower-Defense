#pragma strict

private var timer : float = 0.0f;
public var lifeTime : float = 0.0f;

function Start () 
{

}

function Update () 
{
	timer += Time.deltaTime;
	if(timer >= lifeTime)
	{
		Destroy(gameObject);
	}
}