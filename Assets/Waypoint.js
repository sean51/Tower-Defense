#pragma strict

public var next : GameObject;
public var previous : GameObject;
public var finalPoint : boolean = false;

function OnTriggerEnter(col : Collider)
{
	if(col.gameObject.tag == "Enemy")
	{	
		if(finalPoint)
		{
			Destroy(col.gameObject);
			Level.ESCAPED++;
		}
		else
		{
			col.gameObject.GetComponent(AI).SendMessage("waypointReached", next);
		}
	}
}

function getPrevious() : GameObject
{
	return previous;
}